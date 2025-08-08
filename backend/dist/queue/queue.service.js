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
exports.QueueService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const queue_patient_entity_1 = require("./entities/queue-patient.entity");
const doctor_entity_1 = require("../doctors/entities/doctor.entity");
let QueueService = class QueueService {
    constructor(queueRepository) {
        this.queueRepository = queueRepository;
    }
    async create(createQueuePatientDto) {
        const { assignedDoctorId, ...restOfDto } = createQueuePatientDto;
        const lastPatients = await this.queueRepository.find({
            order: { queueNumber: 'DESC' },
            take: 1,
        });
        const lastPatient = lastPatients[0];
        const newQueueNumber = lastPatient ? lastPatient.queueNumber + 1 : 1;
        const newPatientData = {
            ...restOfDto,
            queueNumber: newQueueNumber,
        };
        if (assignedDoctorId) {
            const doctor = new doctor_entity_1.Doctor();
            doctor.id = assignedDoctorId;
            newPatientData.assignedDoctor = doctor;
        }
        const newPatient = this.queueRepository.create(newPatientData);
        return this.queueRepository.save(newPatient);
    }
    async findAll() {
        return this.queueRepository.find({
            order: { queueNumber: 'ASC' },
        });
    }
    async updateStatus(id, updateQueueStatusDto) {
        const patient = await this.queueRepository.preload({
            id: id,
            ...updateQueueStatusDto,
        });
        if (!patient) {
            throw new common_1.NotFoundException(`Patient with ID #${id} not found in queue`);
        }
        return this.queueRepository.save(patient);
    }
    async remove(id) {
        const result = await this.queueRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Patient with ID #${id} not found to remove`);
        }
    }
};
exports.QueueService = QueueService;
exports.QueueService = QueueService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(queue_patient_entity_1.QueuePatient)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], QueueService);
//# sourceMappingURL=queue.service.js.map