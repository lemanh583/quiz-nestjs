import { Entity, Column} from 'typeorm';
import { BaseEntity } from 'src/common/base/base.entity';
import { MediaType } from 'src/common/enum/media.enum';

@Entity({ name: "medias"})
export class Media extends BaseEntity {
    @Column()
    type: string

    @Column()
    size: string

    @Column()
    src: string

    @Column()
    ref_id: string

    @Column({ type: "enum", enum: MediaType })
    ref_type: MediaType
}