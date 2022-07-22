import { Field, ObjectType } from "@nestjs/graphql";
import { Role } from "src/role/entity/role.entity";
// import { UserRole } from "src/user-role/entity/user-role.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({
  name: 'users'
})
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field()
  id: number

  @Column({ unique: true })
  @Field()
  email: string

  @Column()
  @Field()
  password: string

  @Column({ name: 'full_name' })
  @Field()
  fullName: string

  @Column()
  @Field()
  birthday: Date
  
  @Column({ name: 'created_at' })
  @Field()
  createdAt: Date

  @Column({ name: 'updated_at' })
  @Field()
  updatedAt: Date

  @ManyToMany(type => Role)
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id'
    }
  })
  @Field(type => [Role])
  roles: Role[]
}