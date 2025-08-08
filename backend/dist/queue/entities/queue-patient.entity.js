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
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueuePatient = exports.QueueStatus = void 0;
const doctor_entity_1 = require("../../doctors/entities/doctor.entity");
const typeorm_1 = require("typeorm");
var QueueStatus;
(function (QueueStatus) {
    QueueStatus["WAITING"] = "Waiting";
    QueueStatus["WITH_DOCTOR"] = "With Doctor";
    QueueStatus["COMPLETED"] = "Completed";
})(QueueStatus || (exports.QueueStatus = QueueStatus = {}));
let QueuePatient = class QueuePatient {
    id;
    patientName;
    contactNumber;
    reasonForVisit;
    isUrgent;
    queueNumber;
    status;
    arrivalTime;
    assignedDoctor;
};
exports.QueuePatient = QueuePatient;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], QueuePatient.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], QueuePatient.prototype, "patientName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], QueuePatient.prototype, "contactNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], QueuePatient.prototype, "reasonForVisit", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], QueuePatient.prototype, "isUrgent", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], QueuePatient.prototype, "queueNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: QueueStatus,
        default: QueueStatus.WAITING,
    }),
    __metadata("design:type", String)
], QueuePatient.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], QueuePatient.prototype, "arrivalTime", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => doctor_entity_1.Doctor, { nullable: true, eager: true }),
    __metadata("design:type", doctor_entity_1.Doctor)
], QueuePatient.prototype, "assignedDoctor", void 0);
exports.QueuePatient = QueuePatient = __decorate([
    (0, typeorm_1.Entity)()
], QueuePatient);
//# sourceMappingURL=queue-patient.entity.js.map