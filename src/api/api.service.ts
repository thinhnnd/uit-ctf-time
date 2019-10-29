import { Injectable, OnModuleInit } from "@nestjs/common";
import axios from "axios";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';
import { CONSTANTS } from "../config";
import { CTFEvent } from "./interfaces/ctf-event.interface";
import { CreateCTFEventDto } from "./dtos/create-ctf-event.dto";
@Injectable()
export class ApiService implements OnModuleInit {
    async onModuleInit() {
        //migrate database
        await this.migrateDatabase(100);
    }
    constructor(@InjectModel('CTF_Event') private CTFEventModel: Model<CTFEvent>) { }
    async migrateDatabase(limit: number = 100) {
        try {
            //check database existance
            const r = await this.CTFEventModel.find();
            if (r && r.length > 0) {
                throw new Error('Database already exists');
            }
            const params = {
                limit: limit,
            }
            const events = await axios.get(`${CONSTANTS.CTFTIME_API}/events/`, {
                params: { ...params }
            });
            const data: CTFEvent[] = await events.data;
            const result = await this.CTFEventModel.create(data);
            result.length > 0 ? console.log("Migrated") : console.log("Migrate failed");
        } catch (error) {
            console.log("error migrating ", error);
        }
    }
    async getCTFEvents(): Promise<CTFEvent[]> {
        return await this.CTFEventModel.find();
    }
    async getCTFEvent(id: number): Promise<CTFEvent> {
        return await this.CTFEventModel.findOne({ id });
    }
    async createCTFEvent(newEvent: CreateCTFEventDto): Promise<CTFEvent> {
        return await this.CTFEventModel.create(newEvent);
    }
    async deleteCTFEvent(id: number): Promise<CTFEvent> {
        return
    }
    async updateCTFEvent(id: number, updateCTFEvent: CTFEvent): Promise<CTFEvent> {
        return
    }
}