import { Entity, Column, ManyToOne, JoinColumn} from 'typeorm';
import { BaseEntity } from 'src/common/base/base.entity';
import { PackageType } from 'src/common/enum/package.enum';
import { User } from 'src/user/user.entity';
import { Package } from 'src/package/package.entity';
import { Category } from 'src/category/category.entity';
import { Course } from 'src/course/course.entitty';

@Entity({ name: "transactions"})
export class Transaction extends BaseEntity {
    @Column({ default: 0 })
    price: number

    @Column({ name: 'user_id' })
    user_id: number
    
    @Column({ name: 'package_id' })
    package_id: number

    @ManyToOne(() => User, e => e.transactions, { onDelete: "CASCADE"})
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Package, e => e.transactions, { onDelete: "CASCADE", nullable: true })
    @JoinColumn({ name: 'package_id' })
    package: Package;

    @Column({ default: null })
    time_start: Date

    @Column({ default: null })
    time_end: Date

    // course
    // @ManyToOne(() => Course, c => c.transactions, { onDelete: "CASCADE", nullable: true })
    // @JoinColumn({ name: 'course_id' })
    // course: Course;

    // @Column({ name: 'course_id' })
    // course_id: number

    // category: 
    @ManyToOne(() => Category, c => c.transactions, { onDelete: "CASCADE", nullable: true })
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @Column({ name: 'category_id' })
    category_id: number

}