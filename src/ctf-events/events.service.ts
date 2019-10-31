import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import axios from "axios";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';
import { CONSTANTS } from "../config";
import { CTFEvent } from "./interfaces/ctf-event.interface";
import { CreateCTFEventDto } from "./dtos/create-ctf-event.dto";
@Injectable()
export class CTFEventsService implements OnModuleInit {
    async onModuleInit() {
        //migrate database
        try {
            await this.migrateDatabase(100);
        } catch (error) {
            Logger.error(`Migrate database failed`, error, 'OnModuleInitError');
        }
    }
    constructor(@InjectModel('CTF_Event') private CTFEventModel: Model<CTFEvent>) { }
    private async migrateDatabase(limit: number = 100) {
        try {
            //check database
            Logger.log('Migrating database...', 'Database');
            const r = await this.CTFEventModel.find();
            if (r && r.length > 0) {
                Logger.warn('Database already migrated', 'Database');
                return;
            }
            const params = {
                limit: limit
            }
            const response = await axios.get(`${CONSTANTS.CTFTIME_API}/events/`, {
                params: { ...params },
                headers: {
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.70 Safari/537.36'
                }
            });
            const data: CTFEvent[] = await response.data;
            try {
                const result = await this.CTFEventModel.create(data);
                if (result.length > 0) Logger.log("Migrated", "Database");
            } catch (error) {
                Logger.error("Migrate failed", error, 'DatabaseError');
            }
        } catch (error) {
            Logger.error(`Migrating Database Error : ${error.message}`, error, 'DatabaseError');
        }
    }
    async getCTFEvents(): Promise<CTFEvent[]> {
        return await this.CTFEventModel.find();
    }
    async getCTFEvent(id: string): Promise<CTFEvent> {
        return await this.CTFEventModel.findOne({ id });
    }
    async createCTFEvent(newEvent: CreateCTFEventDto): Promise<CTFEvent> {
        return await this.CTFEventModel.create(newEvent);
    }
    async deleteCTFEvent(id: string): Promise<CTFEvent> {
        return await this.CTFEventModel.findByIdAndDelete(id);
    }
    async updateCTFEvent(id: string, updateCTFEvent: CTFEvent): Promise<CTFEvent> {
        return await this.CTFEventModel.findByIdAndUpdate(id, updateCTFEvent);
    }
}