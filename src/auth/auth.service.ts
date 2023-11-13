import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDTO, SignInDTO } from './types';

import * as Argon2 from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {
    console.log(`Heey, I'm a Provider..`);
  }

  login() {}

  async signup(dto: AuthDTO) {
    const hash = await Argon2.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash: hash,
        },
      });

      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        console.log(error);
        // TODO: Improove error treatment
        throw new ForbiddenException('Credential Taken!');
      }
    }
  }

  async signin(data: SignInDTO) {
    // const user = await this.prisma.user.findUnique({
    //   where: {
    //     email: data.email,
    //   },
    // });
    const user = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) throw new ForbiddenException('User not found!');

    const pwMatches = await Argon2.verify(user.hash, data.password);

    if (!pwMatches) throw new ForbiddenException('Wrong credentials!');

    // delete user.hash;

    // return user;

    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret,
    });

    return {
      access_token: token,
    };
  }
}
