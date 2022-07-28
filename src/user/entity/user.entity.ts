import { Field, ObjectType } from "@nestjs/graphql";
import { Department } from "src/department/entity/department.entity";
import { BaseEntity } from "src/shared/base-entity/base.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({
  name: 'crm_users'
})
@ObjectType()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column({
    unique: true
  })
  username: string

  @Field()
  @Column({
    unique: true
  })
  email: string

  @Column()
  password: string

  @Field({
    nullable: true
  })
  @Column({
    name: 'first_name'
  })
  firstName: string

  @Field({
    nullable: true
  })
  @Column({
    name: 'last_name'
  })
  lastName: string

  @Field({
    nullable: true
  })
  @Column({
    name: 'last_login'
  })
  lastLogin: Date

  @Field({
    nullable: true
  })
  @Column({
    name: 'last_activity'
  })
  lastActivity: string

  @Field({
    nullable: true
  })
  @Column({
    name: 'last_ip'
  })
  lastIp: string

  @Field({
    nullable: true
  })
  @Column()
  avatar: string

  @Field()
  @Column({
    name: 'department_id'
  })
  departmentId: number

  @Field({
    nullable: true
  })
  @ManyToOne(() => Department, x => x.users)
  @JoinColumn({
    name: 'department_id'
  })
  department: Department
}