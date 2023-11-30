import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/base/base.entity';
import { UserRole } from 'src/common/enum/user.enum';
import * as argon2 from 'argon2';
import { ExamHistory } from 'src/exam-history/exam-history.entity';

@Entity({ name: "users"})
export class User extends BaseEntity {
    @Column({ unique: true })
    email: string

    @Column()
    name: string

    @Column()
    password: string

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole

    @OneToMany(() => ExamHistory, (e) => e.user)
    exam_histories: ExamHistory[]

    @BeforeInsert()
    async hasPassword(): Promise<void> {
        this.password = await argon2.hash(this.password)
    }
}