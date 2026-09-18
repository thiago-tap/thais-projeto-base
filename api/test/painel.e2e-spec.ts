/**
 * Testes e2e da API — login, busca, cadastro duplicado e autoexclusão.
 * Usa um banco.json temporário (CAMINHO_BANCO) para não sujar o seed da aula.
 */

import { promises as fs } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';

const seedTeste = {
  usuarios: [
    {
      id: '1',
      nome: 'Admin Teste',
      email: 'admin@sistema.com',
      senhaHash:
        '$2b$10$5g3bzDyFtndv8xNdqjxDNuhROqHhYLOFKn7zMlomeb4MbEDCLef2m',
      perfil: 'Administrador',
      criadoEm: '2026-01-10T10:00:00.000Z',
      atualizadoEm: '2026-01-10T10:00:00.000Z',
    },
    {
      id: '2',
      nome: 'Ana Souza',
      email: 'ana.souza@sistema.com',
      senhaHash:
        '$2b$10$1UbS8Xc2HKX53pKf/fYoZ.m01YnQyhQsbsi6UPCmk77.ZmdNLO7Oq',
      perfil: 'Usuário',
      criadoEm: '2026-01-12T11:00:00.000Z',
      atualizadoEm: '2026-01-12T11:00:00.000Z',
    },
  ],
};

describe('Painel de Usuários (e2e)', () => {
  let app: INestApplication;
  let arquivoTemp: string;
  let tokenAdmin = '';

  beforeAll(async () => {
    arquivoTemp = join(tmpdir(), `painel-banco-teste-${Date.now()}.json`);
    await fs.writeFile(arquivoTemp, JSON.stringify(seedTeste, null, 2), 'utf-8');
    process.env.CAMINHO_BANCO = arquivoTemp;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    const login = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'admin@sistema.com', senha: 'admin123' })
      .expect(201);

    tokenAdmin = login.body.token as string;
  });

  afterAll(async () => {
    await app.close();
    await fs.unlink(arquivoTemp).catch(() => undefined);
    delete process.env.CAMINHO_BANCO;
  });

  it('rejeita login com senha errada', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'admin@sistema.com', senha: 'errada1' })
      .expect(401);
  });

  it('aceita login válido e devolve token', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'admin@sistema.com', senha: 'admin123' })
      .expect(201);

    expect(resposta.body.token).toBeTruthy();
    expect(resposta.body.usuario.email).toBe('admin@sistema.com');
    expect(resposta.body.usuario.senhaHash).toBeUndefined();
  });

  it('filtra usuários por perfil', async () => {
    const resposta = await request(app.getHttpServer())
      .get('/api/usuarios')
      .query({ perfil: 'Usuário' })
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .expect(200);

    expect(resposta.body).toHaveLength(1);
    expect(resposta.body[0].nome).toBe('Ana Souza');
  });

  it('recusa cadastro com e-mail duplicado', async () => {
    await request(app.getHttpServer())
      .post('/api/usuarios')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        nome: 'Outra Ana',
        email: 'ana.souza@sistema.com',
        senha: 'senha123',
        perfil: 'Usuário',
      })
      .expect(409);
  });

  it('bloqueia exclusão da própria conta', async () => {
    const resposta = await request(app.getHttpServer())
      .delete('/api/usuarios/1')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .expect(400);

    expect(resposta.body.message).toMatch(/própria conta/i);
  });

  it('exclui outro usuário com sucesso', async () => {
    await request(app.getHttpServer())
      .delete('/api/usuarios/2')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .expect(200);

    const lista = await request(app.getHttpServer())
      .get('/api/usuarios')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .expect(200);

    expect(lista.body.find((u: { id: string }) => u.id === '2')).toBeUndefined();
  });
});
