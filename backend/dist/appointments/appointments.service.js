"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const appointment_entity_1 = require("./entities/appointment.entity");
const doctor_entity_1 = require("../doctors/entities/doctor.entity");
let AppointmentsService = class AppointmentsService {
    appointmentsRepository;
    constructor(appointmentsRepository) {
        this.appointmentsRepository = appointmentsRepository;
    }
    async create(createAppointmentDto) {
        const { doctorId, patientName, appointmentTime } = createAppointmentDto;
        const doctor = new doctor_entity_1.Doctor();
        doctor.id = doctorId;
        const newAppointment = this.appointmentsRepository.create({
            patientName,
            appointmentTime: new Date(appointmentTime),
            doctor,
        });
        return this.appointmentsRepository.save(newAppointment);
    }
    async findAll() {
        return this.appointmentsRepository.find({ relations: ['doctor'] });
    }
    async findOne(id) {
        const appointment = await this.appointmentsRepository.findOne({
            where: { id },
            relations: ['doctor'],
        });
        if (!appointment) {
            throw new common_1.NotFoundException(`Appointment with ID #${id} not found`);
        }
        return appointment;
    }
    async update(id, updateAppointmentDto) {
        const appointment = await this.appointmentsRepository.preload({
            id: id,
            ...updateAppointmentDto,
        });
        if (!appointment) {
            throw new common_1.NotFoundException(`Appointment with ID #${id} not found to update`);
        }
        return this.appointmentsRepository.save(appointment);
    }
    async remove(id) {
        const result = await this.appointmentsRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Appointment with ID #${id} not found to delete`);
        }
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(appointment_entity_1.Appointment)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map