import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'

describe('UserResolver (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('should return users (GraphQL query example)', async () => {
    const query = `
      query {
        users {
          id
          firstName
          familyName
        }
      }
    `

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200)

    expect(response.body.data.users).toBeDefined()
    // You can add more assertions based on your expected output
  })
})
