import { Field, ObjectType } from "@nestjs/graphql";
import { Company } from "src/company/entity/company.entity";
import { BaseEntity } from "src/shared/base-entity/base.entity";
import { User } from "src/user/entity/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({
  name: 'crm_departments'
})
@ObjectType()
export class Department extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column()
  name: string

  @Field()
  @Column({
    name: 'parent_id'
  })
  parentId: number

  @Field({
    nullable: true
  })
  @Column({
    name: 'phone_number'
  })
  phoneNumber: string

  @Field({
    nullable: true
  })
  @Column({
    name: 'fax_number'
  })
  faxNumber: string

  @Field({
    nullable: true
  })
  @Column()
  email: string

  @Field({
    nullable: true
  })
  @Column()
  address: string

  @Field({
    nullable: true
  })
  @Column({
    name: 'small_logo'
  })
  smallLogo: string

  @Field({
    nullable: true
  })
  @Column({
    name: 'medium_logo'
  })
  mediumLogo: string

  @Field({
    nullable: true
  })
  @Column({
    name: 'large_logo'
  })
  largeLogo: string

  @Field()
  @Column({
    name: 'company_id'
  })
  companyId: number

  @Field({
    nullable: true
  })
  @ManyToOne(() => Department, x => x.childs)
  @JoinColumn({
    name: 'parent_id'
  })
  parent: Department

  @Field(type => [Department], { nullable: true })
  @OneToMany(() => Department, x => x.parent)
  childs: Department[]

  @Field({
    nullable: true
  })
  @ManyToOne(() => Company, x => x.departments)
  @JoinColumn({
    name: 'company_id'
  })
  company: Company

  @Field(type => [User], { nullable: true })
  @OneToMany(() => User, x => x.department)
  users: User[]
}