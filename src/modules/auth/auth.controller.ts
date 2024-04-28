import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from './decorators/current-user.decorator';
import { SkipAuth } from './decorators/skip-auth.decorator';
import { SignInRequestDto } from './dto/request/sign-in.request.dto';
import { SignUpRequestDto } from './dto/request/sign-up.request.dto';
import { AuthUserResponseDto } from './dto/response/auth-user.response.dto';
import { TokenResponseDto } from './dto/response/token.response.dto';

import { IUserData } from './interfaces/user-data.interface';
import { AuthService } from './services/auth.service';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private authService: AuthService) {}

  @SkipAuth()
  @ApiOperation({ summary: 'Registration seller' })
  @Post('sign-up-seller')
  public async signUpSeller(
    @Body() dto: SignUpRequestDto,
  ): Promise<AuthUserResponseDto> {
    return await this.authService.signUpSeller(dto);
  }

  @SkipAuth()
  @ApiOperation({ summary: 'Registration admin' })
  @Post('sign-up-admin')
  public async signUpAdmin(
    @Body() dto: SignUpRequestDto,
  ): Promise<AuthUserResponseDto> {
    return await this.authService.signUpAdmin(dto);
  }

  @SkipAuth()
  @ApiOperation({ summary: 'Login seller' })
  @Post('sign-in-seller')
  public async signInSeller(
    @Body() dto: SignInRequestDto,
  ): Promise<AuthUserResponseDto> {
    return await this.authService.signInSeller(dto);
  }

  @SkipAuth()
  @ApiOperation({ summary: 'Login manager' })
  @Post('sign-in-manager')
  public async signInManager(
    @Body() dto: SignInRequestDto,
  ): Promise<AuthUserResponseDto> {
    return await this.authService.signInManager(dto);
  }

  @SkipAuth()
  @ApiOperation({ summary: 'Login admin' })
  @Post('sign-in-admin')
  public async signInAdmin(
    @Body() dto: SignInRequestDto,
  ): Promise<AuthUserResponseDto> {
    return await this.authService.signInAdmin(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout' })
  @Post('logout')
  public async logout(@CurrentUser() userData: IUserData): Promise<void> {
    await this.authService.logout(userData);
  }

  @SkipAuth()
  @ApiBearerAuth()
  @UseGuards(JwtRefreshGuard)
  @ApiOperation({ summary: 'Update token pair for seller' })
  @Post('refresh-seller')
  public async updateRefreshTokenSeller(
    @CurrentUser() userData: IUserData,
  ): Promise<TokenResponseDto> {
    return await this.authService.updateRefreshTokenSeller(userData);
  }

  @SkipAuth()
  @ApiBearerAuth()
  @UseGuards(JwtRefreshGuard)
  @ApiOperation({ summary: 'Update token pair for manager' })
  @Post('refresh-manager')
  public async updateRefreshTokenManager(
    @CurrentUser() userData: IUserData,
  ): Promise<TokenResponseDto> {
    return await this.authService.updateRefreshTokenManager(userData);
  }

  @SkipAuth()
  @ApiBearerAuth()
  @UseGuards(JwtRefreshGuard)
  @ApiOperation({ summary: 'Update token pair for admin' })
  @Post('refresh-admin')
  public async updateRefreshTokenAdmin(
    @CurrentUser() userData: IUserData,
  ): Promise<TokenResponseDto> {
    return await this.authService.updateRefreshTokenAdmin(userData);
  }
}
