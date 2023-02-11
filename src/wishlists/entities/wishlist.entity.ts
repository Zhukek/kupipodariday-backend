import { Content } from "src/entities/content.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from "typeorm";
import { Length, IsUrl } from "class-validator";
import { User } from "src/users/entities/user.entity";
import { Wish } from "src/wishes/entities/wish.entity";

@Entity()
export class Wishlist extends Content {

    @Column()
    @Length(1, 250)
    name: string;

    @Column({
        default: ''
    })
    @Length(1, 1500)
    description: string;

    @Column()
    @IsUrl()
    image: string;

    @ManyToOne(() => User, (user) => user.wishlists)
    user: User;

    @ManyToMany(() => Wish)
    @JoinTable()
    items: Wish[];
}
