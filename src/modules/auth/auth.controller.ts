import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
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
import { ForgotPasswordRequestDto } from './dto/request/forgot-password.request.dto';
import { SetForgotPasswordRequestDto } from './dto/request/set-forgot-password.request.dto';
import { ChangePasswordRequestDto } from './dto/request/change-password.request.dto';

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

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change password' })
  @Post('change-password')
  public async changePassword(
    @CurrentUser() userData: IUserData,
    @Body() dto: ChangePasswordRequestDto,
  ): Promise<string> {
    return await this.authService.changePassword(dto,userData);
  }
  @SkipAuth()
  @ApiOperation({ summary: 'Forgot password' })
  @Post('forgot-password')
  public async forgotPassword(
    @Body() dto: ForgotPasswordRequestDto,
  ): Promise<string> {
    return await this.authService.forgotPassword(dto);
  }

  @SkipAuth()
  @ApiOperation({ summary: 'Set forgot password' })
  @Post('/forgot-password/:token')
  public async setForgotPassword(
    @Body() dto: SetForgotPasswordRequestDto,
    @Param('token') token: string,
  ): Promise<string> {
    return await this.authService.setForgotPassword(dto, token);
  }
}
