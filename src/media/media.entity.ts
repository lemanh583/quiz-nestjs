import { Entity, Column} from 'typeorm';
import { BaseEntity } from 'src/common/base/base.entity';

@Entity({ name: "medias"})
export class Media extends BaseEntity {
    @Column()
    type: string

    @Column()
    size: string

    @Column()
    src: string
}