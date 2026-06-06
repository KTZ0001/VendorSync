import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(data: any) {
    const { email, password, fullName, role } = data;

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        role: role || 'PROCUREMENT_OFFICER',
      },
    });

    const { password: _, ...result } = user;
    return result;
  }

  async login(credentials: any) {
    const { email, password } = credentials;
    const user = await this.prisma.user.findUnique({ where: { email } });

    console.log(`[DEBUG] Login attempt for email: ${email}`);
    if (!user) {
        console.log(`[DEBUG] User not found`);
        throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`[DEBUG] Password match: ${isMatch}`);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }
}
