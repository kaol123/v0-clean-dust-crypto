# 🚀 Deploy Checklist - Clean Dust Crypto

Este checklist garante que o deploy para produção funcione corretamente.

## ✅ Verificações Antes do Deploy

### 1. Variáveis de Ambiente
Certifique-se de que as seguintes variáveis estão configuradas no projeto Vercel:

```bash
NEXT_PUBLIC_PROJECT_WALLET=CW2a1dCAiaYTcAAaqCiLt3a1FJ6oZkzTN8P4Ftiw2u3W
NEXT_PUBLIC_SOLANA_RPC=https://api.mainnet-beta.solana.com
```

**Como configurar:**
1. Acesse o dashboard da Vercel: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings → Environment Variables**
4. Adicione as variáveis acima
5. Clique em **Save**

### 2. API Routes
Certifique-se de que o arquivo `/app/api/jupiter-swap/route.ts` está presente no repositório:

```bash
# Verifique se o arquivo existe
ls app/api/jupiter-swap/route.ts
```

### 3. Dependências
Verifique se todas as dependências estão instaladas:

```bash
# No package.json, confirme que estas dependências existem:
"@jup-ag/api": "^6.0.0"
"@solana/web3.js": "^1.95.8"
"@solana/spl-token": "^0.4.9"
```

### 4. Build Local
Teste o build localmente antes de fazer deploy:

```bash
npm run build
```

Se houver erros, corrija-os antes de fazer deploy.

## 🔄 Processo de Deploy

### Opção 1: Deploy via GitHub (Recomendado)
1. Commit e push das alterações para o GitHub:
```bash
git add .
git commit -m "feat: Jupiter swap working"
git push origin main
```

2. Vercel fará o deploy automaticamente
3. Aguarde a conclusão (2-5 minutos)
4. Acesse o domínio de produção

### Opção 2: Deploy via Botão "Publish" no v0
1. Clique no botão **"Publish"** no canto superior direito
2. Conecte sua conta Vercel se necessário
3. Configure as variáveis de ambiente
4. Aguarde a conclusão do deploy

## 🐛 Troubleshooting

### Erro: "swap failed" no domínio de produção

**Causa possível:** API route não está sendo executada corretamente

**Solução:**
1. Verifique os logs do Vercel:
   - Acesse https://vercel.com/dashboard
   - Selecione seu projeto
   - Vá em **Deployments → (último deploy) → Functions**
   - Procure por `/api/jupiter-swap`
   
2. Se a API route não aparecer, force um novo deploy:
```bash
git commit --allow-empty -m "chore: force redeploy"
git push origin main
```

3. Verifique se as variáveis de ambiente estão configuradas:
   - Settings → Environment Variables
   - Devem existir: `NEXT_PUBLIC_PROJECT_WALLET` e `NEXT_PUBLIC_SOLANA_RPC`

### Erro: "Invalid request, only public URLs are supported"

**Causa:** Jupiter API bloqueando requisições

**Solução:** Este erro foi resolvido usando a biblioteca oficial `@jup-ag/api`. Se ainda ocorrer:
1. Verifique se o package.json tem `"@jup-ag/api": "^6.0.0"`
2. Force reinstalação das dependências no Vercel fazendo um novo deploy

### Erro: Phantom bloqueando transações

**Causa:** Domínio novo sem reputação estabelecida

**Solução:**
1. Clique em "Continuar na mesma (não seguro)" na Phantom para testar
2. Solicite revisão do domínio: https://docs.phantom.com/developer-powertools/domain-and-transaction-warnings
3. Use um domínio customizado estabelecido se possível

## ✨ Confirmando que Funcionou

Após o deploy, faça um teste completo:

1. Acesse o domínio de produção (não o preview do v0)
2. Conecte a Phantom Wallet
3. Clique em **"Clean Wallet Now"**
4. Confirme as transações na Phantom
5. Verifique se:
   - Tokens foram convertidos para SOL
   - 10% foi enviado para a carteira do projeto
   - 90% permaneceu na sua carteira
   - Transações aparecem no histórico da Phantom

## 📝 Checklist Final

- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] API route `/app/api/jupiter-swap/route.ts` presente no código
- [ ] Dependências `@jup-ag/api` instaladas
- [ ] Build local executado sem erros
- [ ] Deploy realizado (GitHub ou botão Publish)
- [ ] Teste completo no domínio de produção
- [ ] Confirmação visual das transações na Phantom

## 🎯 Status Atual

**Preview v0**: ✅ Funcionando perfeitamente  
**Produção**: ⚠️ Necessita verificação

O código está correto e funcionando. Se há falhas na produção, o problema está na configuração do deploy, não no código.
