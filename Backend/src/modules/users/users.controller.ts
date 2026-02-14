import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Query,
  Delete,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../enums/role.enum';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';

import { UpdateProfileDto, ChangePasswordDto } from './dto/update-profile.dto';

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.userId, updateProfileDto);
  }

  @Delete('profile/avatar')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user avatar' })
  deleteAvatar(@Request() req) {
    return this.usersService.deleteAvatar(req.user.userId);
  }

  @Post('change-password')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change user password' })
  async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    try {
      return await this.usersService.changePassword(req.user.userId, changePasswordDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('dashboard/stats')
  @Roles(Role.STUDENT, Role.ADMIN) // Allow admin to see too? Or just student.
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get student dashboard stats' })
  getDashboardStats(@Request() req) {
    return this.usersService.getStudentDashboardStats(req.user.userId);
  }

  @Get('stats/students')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get student statistics (Admin only)' })
  getStudentStats() {
    return this.usersService.getStudentStats();
  }

  @Get('stats/teachers')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get teacher statistics (Admin only)' })
  getTeacherStats() {
    return this.usersService.getTeacherStats();
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all users (Admin only)' })
  findAll(@Query('role') role?: Role) {
    return this.usersService.findAll(role);
  }

  @Post()
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new user (Admin only)' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a user (Admin only)' })
  async delete(@Param('id') id: string, @Request() req) {
    // Prevent self-deletion
    if (id === req.user.userId) {
      throw new BadRequestException('Cannot delete your own account');
    }
    return this.usersService.delete(id);
  }
}
