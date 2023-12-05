import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BeforeInsert } from "typeorm"

export abstract class BaseEntity {
    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    @Column({ default: null})
    deleted_at: Date

    @PrimaryGeneratedColumn()
    id: number;
}