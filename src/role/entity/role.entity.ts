import { Field, ObjectType } from "@nestjs/graphql";
import { Test } from "src/test/entity/test.entity";
import { User } from "src/user/entity/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({
  name: 'roles'
})
@ObjectType()
export class Role {
  @PrimaryGeneratedColumn({
    name: 'role_id'
  })
  @Field()
  id: number

  @Column({ name: 'role_name' })
  @Field()
  roleName: string
  
  @Column({ name: 'created_at' })
  @Field()
  createdAt: Date

  @Column({ name: 'updated_at' })
  @Field()
  updatedAt: Date

  @OneToMany(() => Test, (test) => test.role)
  @JoinColumn({ name: 'role_id' })
  @Field(type => [Test])
  tests: Test[]
}