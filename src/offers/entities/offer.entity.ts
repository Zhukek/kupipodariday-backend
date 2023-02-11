import { Content } from "src/entities/content.entity";
import { User } from "src/users/entities/user.entity";
import { Wish } from "src/wishes/entities/wish.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { IsBoolean } from "class-validator";

@Entity()
export class Offer extends Content {

    @ManyToOne(() => User, (user) => user.offers)
    user: User;

    @ManyToOne(() => Wish, (wish) => wish.offers)
    item: Wish[];

    @Column({
        type: 'numeric',
        scale: 2,
    })
    amount: number;

    @Column({
        default: false
    })
    @IsBoolean()
    hidden: boolean;
}
