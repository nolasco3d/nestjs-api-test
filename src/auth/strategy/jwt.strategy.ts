import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

export interface TokenInterface {
  sub: string | number;
  emai: string;
  [propName: string]: unknown;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(token: TokenInterface): Promise<any> {
    console.log(token);
    const user = await this.prisma.user.findUnique({
      where: {
        id: token.sub as number,
      },
    });

    if (user) delete user.hash;

    // if (!user) throw new ForbiddenException('User not found!');

    // const pwMatches = await Argon2.verify(user.hash, data.password);

    // if (!pwMatches) throw new ForbiddenException('Wrong credentials!');

    // console.log({ token });
    return user;
  }
}
