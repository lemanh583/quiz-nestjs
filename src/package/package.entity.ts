import { Entity, Column, OneToMany} from 'typeorm';
import { BaseEntity } from 'src/common/base/base.entity';
import { PackageType } from 'src/common/enum/package.enum';
import { Transaction } from 'src/transaction/transaction.entity';

@Entity({ name: "packages"})
export class Package extends BaseEntity {
    @Column({ type: "enum", enum: PackageType, default: PackageType.free })
    type: PackageType

    @Column({ default: null })
    title: string

    @Column({ default: 0 })
    price: number

    @Column({ default: null })
    describe: string

    @Column({ default: null })
    time: string  

    @OneToMany(() => Transaction, (e) => e.package)
    transactions: Transaction[]
}