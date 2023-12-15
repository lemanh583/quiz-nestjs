import { Entity, Column, ManyToOne, JoinColumn} from 'typeorm';
import { BaseEntity } from 'src/common/base/base.entity';
import { PackageType } from 'src/common/enum/package.enum';
import { User } from 'src/user/user.entity';
import { Package } from 'src/package/package.entity';
import { Category } from 'src/category/category.entity';

@Entity({ name: "transactions"})
export class Transaction extends BaseEntity {
    @Column({ default: 0 })
    price: number

    @Column({ name: 'user_id' })
    user_id: number
    
    @Column({ name: 'package_id' })
    package_id: number

    @Column({ name: 'category_id' })
    category_id: number

    @ManyToOne(() => User, e => e.transactions, { onDelete: "CASCADE"})
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Package, e => e.transactions, { onDelete: "CASCADE", nullable: true})
    @JoinColumn({ name: 'package_id' })
    package: Package;

    @ManyToOne(() => Category, e => e.transactions, { onDelete: "CASCADE", nullable: true})
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @Column({ default: null })
    time_start: Date

    @Column({ default: null })
    time_end: Date
}