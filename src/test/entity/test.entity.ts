import { Field, ObjectType } from "@nestjs/graphql";
import { Role } from "src/role/entity/role.entity";
import { Test1 } from "src/test1/entity/test.entity";
import { User } from "src/user/entity/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({
  name: 'test'
})
@ObjectType()
export class Test {
  @PrimaryGeneratedColumn({
    name: 'id'
  })
  @Field()
  id: number

  @Column({ name: 'role_id' })
  @Field()
  roleId: number

  @ManyToOne(() => Role, (role) => role.tests)
  @JoinColumn({ name: "role_id" })
  role: Role

  @OneToMany(() => Test1, (test1) => test1.test)
  @Field(type => [Test1])
  test1s: Test1
}