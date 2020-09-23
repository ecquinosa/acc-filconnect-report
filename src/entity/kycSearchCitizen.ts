import { Entity, Column, OneToMany, Generated } from "typeorm";
import { Base } from "./Base";
//import { MemberAddress } from "./memberAddress";

@Entity({ name: "KycSearchCitizen" })
export class KycSearchCitizen extends Base {

  @Column({
    default: "00000000-0000-0000-0000-000000000000",
    type: "uniqueidentifier",
  })
  memberId: string; 
    
  @Column({
    default: "00000000-0000-0000-0000-000000000000",
    type: "uniqueidentifier",    
    nullable: true
  })
  userProfileId: string;

  @Column({
    default: "00000000-0000-0000-0000-000000000000",
    type: "uniqueidentifier",
  })
  institutionId: string;  

  @Column({
    length: 50,
  })
  lastName: string;

  @Column({
    length: 50,
  })
  firstName: string;

  @Column({
    length: 50,
    nullable: true
  })
  middleName: string;

  @Column({
    length: 10,
    nullable: true
  })
  suffix: string;

  @Column({
    length: 6,
    nullable: true
  })
  gender: string;

  @Column({
    default: "00000000-0000-0000-0000-000000000000",
    type: "uniqueidentifier",
    nullable: true,
  })
  civilStatusId: string;

  @Column({
    length: 20,
    nullable: true,
  })
  civilStatus: string;

  @Column()
  birthDate: Date;

  @Column({
    default: "0000",
    length: 10,
  }) 
  birthDay: string;

  @Column({ name: "age", type: "int", nullable: true, })
  age: number;

  @Column({
    length: 10,
    nullable: true,
  })
  ageBracket: string;
  
  @Column({
    default: "00000000-0000-0000-0000-000000000000",
    type: "uniqueidentifier",
    nullable: true,
  })
  birthCityId: string;

  @Column({
    length: 40,
    nullable: true,
  })
  birthCity: string;

  @Column({
    default: "00000000-0000-0000-0000-000000000000",
    type: "uniqueidentifier",
    nullable: true,
  })
  birthProvinceId: string;

  @Column({
    length: 40,
    nullable: true,
  })
  birthProvince: string;

  @Column({nullable: true,})
  noOfChildren: number;

  @Column({
    default: "00000000-0000-0000-0000-000000000000",
    type: "uniqueidentifier",
    nullable: true,
  })
  employmentStatusId: string;

  @Column({
    length: 50,
    nullable: true,
  })
  employmentStatus: string;

  @Column()
  isRegisteredVoter: boolean;

  @Column({
    default: false,
    nullable: true,
  }
  )
  isPwd: boolean;

  @Column({
    default: false,
    nullable: true,
  }
  )
  isDependent: boolean; 

  @Column({
    length: 50,
    nullable: true,
  })
  presentRoomFloorUnitBldg: string;

  @Column({
    length: 50,
    nullable: true,
  })
  presentHouseLotBlock: string;

  @Column({
    length: 50,
    nullable: true,
  })
  presentStreetname: string;

  @Column({
    length: 50,
    nullable: true,
  })
  presentSubdivision: string;

  @Column({
    default: "00000000-0000-0000-0000-000000000000",
    type: "uniqueidentifier",
    nullable: true,
  })
  presentBarangayId: string;

  @Column({
    length: 50,
    nullable: true,
  })
  presentBarangay: string;

  @Column({
    default: "00000000-0000-0000-0000-000000000000",
    type: "uniqueidentifier",
    nullable: true,
  })  
  presentCityId: string;

  @Column({
    length: 100,
    nullable: true,
  })
  presentCity: string;

  @Column({
    default: "00000000-0000-0000-0000-000000000000",
    type: "uniqueidentifier",
    nullable: true,
  })  
  presentProvinceId: string;

  @Column({
    length: 100,
    nullable: true,
  })
  presentProvince: string;  

  @Column({
    length: 6,
    nullable: true,
  })
  presentPostal: string;

  @Column({
    default: "00000000-0000-0000-0000-000000000000",
    type: "uniqueidentifier",
  })  
  presentDistrictId: string;

  @Column({
    length: 50,
    nullable: true
  })
  presentDistrict: string;

  @Column({
    length: 20,
    nullable: true,
  })
  telephoneNos: string;

  @Column({
    length: 20,
    nullable: true,
  })
  mobileNos: string;

  @Column({
    length: 50,
    nullable: true,
  })
  email: string;

}
