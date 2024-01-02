import { Entity, Column} from 'typeorm';
import { BaseEntity } from 'src/common/base/base.entity';
import { MediaType } from 'src/common/enum/media.enum';

@Entity({ name: "medias"})
export class Media extends BaseEntity {
    @Column({ default: null })
    name: string

    @Column({ default: null })
    type: string

    @Column({ default: null })
    mimetype: string

    @Column({ default: null})
    size: number

    @Column({ default: null})
    src: string

    @Column({ default: null })
    ref_id: number

    @Column({ type: "enum", enum: MediaType, default: null })
    ref_type: MediaType

    @Column({ default: null })
    local_path: string
}