import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards } from '@nestjs/common';
    import { DoctorsService } from './doctors.service';
    import { CreateDoctorDto } from './dto/create-doctor.dto';
    import { UpdateDoctorDto } from './dto/update-doctor.dto';
    import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

    @Controller('doctors') // This means all routes in this controller start with /doctors
    export class DoctorsController {
      constructor(private readonly doctorsService: DoctorsService) {}
      
      @UseGuards(JwtAuthGuard)
      @Post() // Handles POST /doctors
      create(@Body() createDoctorDto: CreateDoctorDto) {
        return this.doctorsService.create(createDoctorDto);
      }

      @Get() // Handles GET /doctors
      findAll() {
        return this.doctorsService.findAll();
      }

      @Get(':id') // Handles GET /doctors/123
      findOne(@Param('id') id: string) {
        return this.doctorsService.findOne(+id);
      }

      @Patch(':id') // Handles PATCH /doctors/123
      update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto) {
        return this.doctorsService.update(+id, updateDoctorDto);
      }

      @Delete(':id') // Handles DELETE /doctors/123
      remove(@Param('id') id: string) {
        return this.doctorsService.remove(+id);
      }
    }