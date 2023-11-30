import { Entity, Column, BeforeInsert, BeforeUpdate, Repository, EntitySubscriberInterface } from 'typeorm';
import { BaseEntity } from 'src/common/base/base.entity';
import { SlugType } from 'src/common/enum/slug.enum';
@Entity({ name: "slugs"})
export class Slug extends BaseEntity  {

    @Column({ unique: true })
    slug: string

    @Column({
        type: 'enum',
        enum: SlugType,
    })
    type: SlugType


    // @BeforeInsert()
    // removeAccent(): void {
    //     let withTime = [SlugType.exam, SlugType.post].includes(this.type)
    //     this.slug = Helper.removeAccents(this.slug, withTime)
    // }

    // @BeforeUpdate()
    // removeAccentBeforeUpdate(): void {
    //     let withTime = [SlugType.exam, SlugType.post].includes(this.type)
    //     this.slug = Helper.removeAccents(this.slug, withTime)
    // }

}