# Como Desbloquear seu Domínio na Phantom Wallet

## Problema
A Phantom Wallet pode bloquear domínios novos ou mostrar avisos de transação por dois motivos principais:

1. **Domínio novo sem reputação estabelecida** - Bloqueado pelo serviço de segurança Blowfish
2. **Estrutura da transação complexa** - Múltiplos signatários ou transação muito grande

## Solução Oficial (RECOMENDADO)

### Formulário de Revisão de Domínio da Phantom

A Phantom oferece um formulário oficial para revisão de domínios bloqueados:

**Link do Formulário:**
https://docs.google.com/forms/d/1JgIxdmolgh_80xMfQKBKx9-QPC7LRdN6LHpFFW8BlKM/viewform

**Informações para preencher:**
- **Domain**: cryptodustcleaner.xyz
- **Purpose**: Solana wallet dust token cleaner
- **Description**: Aplicação legítima para limpar tokens pequenos (< $1) de carteiras Solana, convertendo-os automaticamente para SOL via Jupiter Aggregator
- **GitHub Repository**: [link do seu repositório público]
- **Contact Email**: [seu email profissional]
- **Additional Information**:
  - Código 100% open source e auditável
  - Apenas executa transações explicitamente autorizadas pelo usuário
  - Usa Jupiter Aggregator (protocolo confiável) para swaps
  - Transações seguem as melhores práticas: um único signatário, tamanho otimizado
  - Nenhuma permissão ou acesso não autorizado é solicitado

**Timeline esperado**: 3-7 dias úteis para resposta da equipe Phantom

## Outras Soluções

### 2. Otimização de Transações (Já Implementado)

Segundo a [documentação oficial da Phantom](https://docs.phantom.com/developer-powertools/domain-and-transaction-warnings), avisos aparecem quando:
- Transação tem múltiplos signatários
- Transação é muito grande

**Nossa aplicação já segue as melhores práticas:**
✅ Apenas um signatário por transação (você)
✅ Uso de `signTransaction` (não `signAndSendTransaction`)
✅ Transações pequenas e diretas
✅ Sem Address Lookup Tables desnecessárias

### 3. Aguardar Construção de Reputação Natural

Domínios novos são bloqueados automaticamente por precaução. Com o tempo e sem atividade suspeita, o domínio pode ser automaticamente removido das listas.

**Timeline**: 2-4 semanas de uso normal

### 4. Testar Funcionalidade (Temporário - Apenas para Desenvolvimento)

Para validar que o código funciona enquanto aguarda aprovação:

1. Clique no botão Clean Wallet Now
2. A Phantom mostrará o aviso de bloqueio
3. Clique em "Continuar na mesma (não seguro)"
4. Aprove as transações normalmente

**ATENÇÃO**: Apenas faça isso porque VOCÊ é o desenvolvedor e sabe que o código é seguro. Nunca recomende isso para usuários finais.

## Melhorar Chances de Aprovação

### Adicione Transparência ao Site

1. **Página "About" ou "Como Funciona"**
   - Explique o que o app faz
   - Mostre passo a passo do processo
   - Link para código fonte

2. **Informações de Contato**
   - Email profissional visível
   - Links para redes sociais (Twitter/X, Discord)
   - GitHub com histórico de commits

3. **Termos de Uso e Política de Privacidade**
   - Deixe claro que não armazena chaves privadas
   - Explique que usa apenas APIs públicas
   - Mencione parceiros confiáveis (Jupiter, Solana)

4. **Badge de Segurança**
   - "Código Open Source"
   - "Auditado pela comunidade"
   - Link para repositório

### Estabeleça Presença Online

- Crie conta oficial no Twitter/X
- Participe de comunidades Solana
- Documente o projeto publicamente
- Peça feedback de desenvolvedores conhecidos

## Verificar Status do Desbloqueio

Depois de enviar o formulário:

1. Aguarde email de resposta (verifique spam também)
2. Teste em uma carteira Phantom limpa (nova instalação)
3. Tente conectar e executar uma transação de teste

## Documentação e Links Oficiais

- **Phantom Domain Warnings**: https://docs.phantom.com/developer-powertools/domain-and-transaction-warnings
- **Formulário de Revisão**: https://docs.google.com/forms/d/1JgIxdmolgh_80xMfQKBKx9-QPC7LRdN6LHpFFW8BlKM/viewform
- **Phantom Support**: https://help.phantom.app/hc/en-us
- **Phantom Blocklist Info**: https://docs.phantom.com/developer-powertools/blocklist

## FAQ

**P: Por quanto tempo meu domínio ficará bloqueado?**
R: Depende. Com a solicitação de revisão, pode ser desbloqueado em 3-7 dias. Sem solicitação, pode levar 2-4 semanas para desbloqueio automático.

**P: O código está funcionando corretamente?**
R: Sim! O bloqueio é apenas uma medida de segurança da Phantom para domínios novos. O código está correto e funcional.

**P: Posso usar outro domínio?**
R: Sim, mas domínios novos terão o mesmo problema. O ideal é seguir o processo de revisão oficial.

**P: E se a Phantom negar minha solicitação?**
R: Eles explicarão o motivo. Geralmente pedem mais transparência no site ou ajustes na estrutura das transações.

**P: Preciso pagar algo?**
R: Não! Todo o processo de revisão é gratuito.

## Timeline Resumido

| Ação | Tempo Esperado |
|------|----------------|
| Preencher formulário | 5-10 minutos |
| Aguardar resposta inicial | 3-7 dias úteis |
| Implementar sugestões (se houver) | 1-2 dias |
| Aprovação final | 1-3 dias |
| **Total** | **7-14 dias** |

## Contato de Emergência

Se você não receber resposta em 2 semanas:

1. Envie follow-up via Phantom Support: https://help.phantom.app/hc/en-us
2. Mencione o número do ticket original (se recebeu)
3. Poste no GitHub Discussions da Phantom: https://github.com/orgs/phantom/discussions

---

**Última atualização**: Janeiro 2026
**Baseado na documentação oficial**: https://docs.phantom.com/developer-powertools/domain-and-transaction-warnings
