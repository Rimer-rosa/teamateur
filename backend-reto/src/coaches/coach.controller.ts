import { Controller, Post, Get, Body, Patch, Param } from '@nestjs/common';
import { CoachService } from './coach.service';
import { CreateCoachDto } from './dto/create-coach.dto';

@Controller('coaches')
export class CoachController {
  constructor(private readonly coachService: CoachService) {}

  @Post()
  create(@Body() createCoachDto: CreateCoachDto) {
    return this.coachService.create(createCoachDto);
  }

  @Get()
  findAll() {
    return this.coachService.findAll();
  }

  @Get('available')
  getAvailableCoaches() {
    return this.coachService.getAvailableCoaches();
  }

  @Patch(':id/assign')
  async assignToTeam(
    @Param('id') coachId: string,
    @Body() { teamId }: { teamId: string },
  ) {
    const result = await this.coachService.assignToTeam(coachId, teamId);
    return {
      success: true,
      coach: {
        id: result.coach.id,
        name: result.coach.name,
      },
      team: {
        id: result.team.id,
        name: result.team.name,
      },
    };
  }
}
