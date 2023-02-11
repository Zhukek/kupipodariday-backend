import { Content } from "src/entities/content.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Length, IsUrl, IsInt } from "class-validator";
import { User } from "src/users/entities/user.entity";
import { Offer } from "src/offers/entities/offer.entity";

@Entity()
export class Wish extends Content {

    @Column()
    @Length(1, 250)
    name: string;

    @Column()
    @IsUrl()
    link: string;

    @Column()
    @IsUrl()
    image: string;
    
    @Column({
        type: 'numeric',
        precision: 10,
        scale: 2
    })
    price: number;

    @Column({
        type: 'numeric',
        precision: 10,
        scale: 2,
        default: 0
    })
    raised: number;
    
    @ManyToOne(() => User, (user) => user.wishes)
    owner: User;

    @Column({
        default: ''
    })
    @Length(1, 1024)
    description: string;

    @OneToMany(() => Offer, (offer) => offer.item)
    offers: Offer[];

    @Column({
        default: 0
    })
    @IsInt()
    copied: number;
}
