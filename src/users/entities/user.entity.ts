import { Length, IsUrl, IsEmail,IsNotEmpty } from "class-validator";
import { Content } from "src/entities/content.entity";
import { USER_ABOUT_DEFAULT, USER_AVATAR_DEFAULT } from "src/utils/consts";
import { Column, Entity, OneToMany} from "typeorm";
import { Wish } from "src/wishes/entities/wish.entity";
import { Offer } from "src/offers/entities/offer.entity";
import { Wishlist } from "src/wishlists/entities/wishlist.entity";

@Entity()
export class User extends Content {

    @Column({
        unique: true
    })
    @IsNotEmpty()
    @Length(2, 30)
    username: string;

    @Column({
        default: USER_ABOUT_DEFAULT
    })
    @Length(2, 200)
    about: string;

    @Column({
        default: USER_AVATAR_DEFAULT
    })
    @IsUrl()
    avatar: string;

    @Column({
        unique: true
    })
    @IsEmail()
    email: string;

    @Column()
    @IsNotEmpty()
    password: string;

    @OneToMany(() => Wish, (wish) => wish.owner)
    wishes: Wish[];

    @OneToMany(() => Offer, (offer) => offer.user)
    offers: Offer[];

    @OneToMany(() => Wishlist, (wishlist) => wishlist.user)
    wishlists: Wishlist[];
}
