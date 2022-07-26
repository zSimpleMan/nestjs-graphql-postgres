import { Field, ObjectType } from "@nestjs/graphql";
import { Role } from "src/role/entity/role.entity";
import { Test } from "src/test/entity/test.entity";
import { User } from "src/user/entity/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({
  name: 'test1'
})
@ObjectType()
export class Test1 {
  @PrimaryGeneratedColumn({
    name: 'id'
  })
  @Field()
  id: number

  @Column({ name: 'test_id' })
  @Field()
  testId: number

  @ManyToOne(() => Test, (test) => test.test1s)
  @JoinColumn({ name: "test_id" })
  test: Test
}