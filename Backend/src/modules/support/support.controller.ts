import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { SupportService } from './support.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { AddMessageDto } from './dto/add-message.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../enums/role.enum';

@Controller('support')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class SupportController {
    constructor(private readonly supportService: SupportService) { }

    @Post('tickets')
    @Roles(Role.STUDENT)
    createTicket(@Req() req: any, @Body() createTicketDto: CreateTicketDto) {
        const userId = req.user.userId;
        const franchiseId = req.user.franchise_id || null;
        return this.supportService.createTicket(userId, franchiseId, createTicketDto);
    }

    @Get('tickets/student')
    @Roles(Role.STUDENT)
    getStudentTickets(@Req() req: any) {
        return this.supportService.getStudentTickets(req.user.userId);
    }

    @Get('tickets/admin')
    @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.FRANCHISE_ADMIN)
    getAdminTickets(@Req() req: any) {
        const franchiseId = req.user.franchise_id || null;
        return this.supportService.getAdminTickets(franchiseId);
    }

    @Get('tickets/:id')
    getTicketDetails(@Param('id') id: string, @Req() req: any) {
        const franchiseId = req.user.franchise_id || null;
        return this.supportService.getTicketDetails(id, req.user.userId, req.user.role, franchiseId);
    }

    @Post('tickets/:id/messages')
    addMessage(@Param('id') id: string, @Req() req: any, @Body() addMessageDto: AddMessageDto) {
        const franchiseId = req.user.franchise_id || null;
        return this.supportService.addMessage(id, req.user.userId, req.user.role, franchiseId, addMessageDto);
    }

    @Patch('tickets/:id/close')
    closeTicket(@Param('id') id: string, @Req() req: any) {
        const franchiseId = req.user.franchise_id || null;
        return this.supportService.closeTicket(id, req.user.userId, req.user.role, franchiseId);
    }
}
