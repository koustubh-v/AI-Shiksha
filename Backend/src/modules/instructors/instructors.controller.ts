import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { InstructorsService } from './instructors.service';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport'; // Or use generic guard
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Role } from '../../enums/role.enum';

@ApiTags('Instructors')
@Controller('instructors')
export class InstructorsController {
  constructor(private readonly instructorsService: InstructorsService) {}

  @Get('admin/list')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all instructors with stats (Admin)' })
  getAdminList() {
    return this.instructorsService.findAllWithStats();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Become an instructor (create profile)' })
  create(@Request() req, @Body() createInstructorDto: CreateInstructorDto) {
    return this.instructorsService.create(req.user.userId, createInstructorDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all instructors' })
  findAll() {
    return this.instructorsService.findAll();
  }

  @Get('dashboard/stats')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.INSTRUCTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get instructor dashboard stats' })
  getDashboardStats(@Request() req) {
    return this.instructorsService.getDashboardStats(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get instructor details' })
  findOne(@Param('id') id: string) {
    return this.instructorsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update instructor profile' })
  update(
    @Param('id') id: string,
    @Body() updateInstructorDto: UpdateInstructorDto,
  ) {
    // TODO: Verify that the user owns this profile or is admin
    return this.instructorsService.update(id, updateInstructorDto);
  }
}
