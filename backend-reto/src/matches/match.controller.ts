import { Controller, Post, Get, Body } from '@nestjs/common';
import { MatchService } from './match.service';

@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post('simulate')
  simulate(@Body() body: { teamAId: string; teamBId: string }) {
    return this.matchService.simulateMatch(body.teamAId, body.teamBId);
  }

  @Get()
  findAll() {
    return this.matchService.findAll();
  }
}
