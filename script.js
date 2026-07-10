/* =============================================
   VIVA MAIS — script.js
   Interatividade leve e acessível
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ----- Cards expandíveis de dicas de saúde ----- */
  var cardsExpandiveis = document.querySelectorAll('.card-dica-expandivel');

  cardsExpandiveis.forEach(function (card) {
    var header = card.querySelector('.card-dica-header');
    var conteudo = card.querySelector('.card-dica-conteudo');

    if (!header || !conteudo) return;

    header.addEventListener('click', function () {
      var estaAberto = card.classList.contains('aberto');

      /* fecha todos primeiro */
      cardsExpandiveis.forEach(function (outro) {
        outro.classList.remove('aberto');
        outro.setAttribute('aria-expanded', 'false');
      });

      /* abre o clicado se estava fechado */
      if (!estaAberto) {
        card.classList.add('aberto');
        card.setAttribute('aria-expanded', 'true');
      }
    });

    /* acessibilidade via teclado */
    header.setAttribute('tabindex', '0');
    header.setAttribute('role', 'button');
    header.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        header.click();
      }
    });
  });

  /* ----- Saudação dinâmica por hora do dia ----- */
  var elementoSaudacao = document.getElementById('saudacao');
  if (elementoSaudacao) {
    var hora = new Date().getHours();
    var saudacao = 'Boa noite!';
    if (hora >= 5 && hora < 12)  saudacao = 'Bom dia!';
    else if (hora >= 12 && hora < 18) saudacao = 'Boa tarde!';
    elementoSaudacao.textContent = saudacao;
  }

  /* ----- Banner de emergência via botão do header ----- */
  var btnEmergenciaHeader = document.getElementById('btn-emergencia-header');
  var bannerSos = document.getElementById('banner-sos');
  var btnFecharBanner = document.getElementById('fechar-banner');

  if (btnEmergenciaHeader && bannerSos) {
    btnEmergenciaHeader.addEventListener('click', function (e) {
      e.preventDefault();
      bannerSos.classList.add('visivel');

      /* fecha automaticamente após 8 segundos */
      setTimeout(function () {
        bannerSos.classList.remove('visivel');
      }, 8000);
    });
  }

  if (btnFecharBanner && bannerSos) {
    btnFecharBanner.addEventListener('click', function () {
      bannerSos.classList.remove('visivel');
    });
  }

  /* ----- Scroll suave para âncoras ----- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var alvo = document.querySelector(this.getAttribute('href'));
      if (alvo) {
        e.preventDefault();
        alvo.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ----- Feedback visual ao tocar em cards de emergência ----- */
  document.querySelectorAll('.card-emergencia').forEach(function (card) {
    card.addEventListener('touchstart', function () {
      card.style.opacity = '0.85';
    }, { passive: true });
    card.addEventListener('touchend', function () {
      card.style.opacity = '';
    }, { passive: true });
  });

  /* =============================================
     CONTROLE DE TAMANHO DE FONTE (A+ / A-)
     ============================================= */

  var btnAumentar = document.getElementById('btn-aumentar-fonte');
  var btnDiminuir = document.getElementById('btn-diminuir-fonte');
  var tamanhoAtual = carregarPreferencia('vivamais-fonte') || 'normal';

  aplicarTamanhoFonte(tamanhoAtual);

  if (btnAumentar) {
    btnAumentar.addEventListener('click', function () {
      if (tamanhoAtual === 'pequena') {
        tamanhoAtual = 'normal';
      } else if (tamanhoAtual === 'normal') {
        tamanhoAtual = 'grande';
      }
      aplicarTamanhoFonte(tamanhoAtual);
      salvarPreferencia('vivamais-fonte', tamanhoAtual);
    });
  }

  if (btnDiminuir) {
    btnDiminuir.addEventListener('click', function () {
      if (tamanhoAtual === 'grande') {
        tamanhoAtual = 'normal';
      } else if (tamanhoAtual === 'normal') {
        tamanhoAtual = 'pequena';
      }
      aplicarTamanhoFonte(tamanhoAtual);
      salvarPreferencia('vivamais-fonte', tamanhoAtual);
    });
  }

  function aplicarTamanhoFonte(tamanho) {
    document.body.classList.remove('fonte-grande', 'fonte-pequena');
    if (tamanho === 'grande') {
      document.body.classList.add('fonte-grande');
    } else if (tamanho === 'pequena') {
      document.body.classList.add('fonte-pequena');
    }
  }

  /* =============================================
     MODO ALTO CONTRASTE
     ============================================= */

  var btnContraste = document.getElementById('btn-contraste');
  var contrasteAtivo = carregarPreferencia('vivamais-contraste') === 'true';

  if (contrasteAtivo) {
    document.body.classList.add('alto-contraste');
    if (btnContraste) btnContraste.classList.add('ativo');
  }

  if (btnContraste) {
    btnContraste.addEventListener('click', function () {
      contrasteAtivo = !contrasteAtivo;
      document.body.classList.toggle('alto-contraste', contrasteAtivo);
      btnContraste.classList.toggle('ativo', contrasteAtivo);
      salvarPreferencia('vivamais-contraste', contrasteAtivo.toString());

      /* atualiza aria-label */
      btnContraste.setAttribute(
        'aria-label',
        contrasteAtivo ? 'Desativar modo de alto contraste' : 'Ativar modo de alto contraste'
      );
    });
  }

  /* =============================================
     CHECKLIST DO DIA — salva por data
     ============================================= */

  var checklistInputs = document.querySelectorAll('.checklist-input');
  var feedbackEl = document.getElementById('checklist-feedback');
  var hoje = new Date().toISOString().slice(0, 10); /* YYYY-MM-DD */
  var checklistSalvo = carregarJSON('vivamais-checklist-' + hoje) || {};

  /* restaura estado salvo */
  checklistInputs.forEach(function (input) {
    var item = input.getAttribute('data-item');
    if (checklistSalvo[item]) {
      input.checked = true;
    }

    input.addEventListener('change', function () {
      checklistSalvo[item] = input.checked;
      salvarJSON('vivamais-checklist-' + hoje, checklistSalvo);
      atualizarFeedbackChecklist();
    });
  });

  atualizarFeedbackChecklist();

  function atualizarFeedbackChecklist() {
    if (!feedbackEl) return;
    var total = checklistInputs.length;
    var marcados = 0;
    checklistInputs.forEach(function (input) {
      if (input.checked) marcados++;
    });

    feedbackEl.classList.remove('visivel', 'parcial', 'completo');

    if (marcados === 0) {
      return;
    }

    feedbackEl.classList.add('visivel');

    if (marcados === total) {
      feedbackEl.classList.add('completo');
      feedbackEl.textContent = '🎉 Parabéns! Você completou todas as atividades de hoje!';
    } else {
      feedbackEl.classList.add('parcial');
      feedbackEl.textContent = '👍 Muito bem! ' + marcados + ' de ' + total + ' atividades feitas.';
    }
  }

  /* =============================================
     BOTÃO VOLTAR AO TOPO
     ============================================= */

  var btnTopo = document.getElementById('btn-topo');

  if (btnTopo) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 600) {
        btnTopo.classList.add('visivel');
      } else {
        btnTopo.classList.remove('visivel');
      }
    }, { passive: true });

    btnTopo.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* =============================================
     UTILITÁRIOS — localStorage com fallback
     ============================================= */

  function salvarPreferencia(chave, valor) {
    try {
      localStorage.setItem(chave, valor);
    } catch (e) {
      /* silencioso — funciona sem storage */
    }
  }

  function carregarPreferencia(chave) {
    try {
      return localStorage.getItem(chave);
    } catch (e) {
      return null;
    }
  }

  function salvarJSON(chave, obj) {
    try {
      localStorage.setItem(chave, JSON.stringify(obj));
    } catch (e) { /* silencioso */ }
  }

  function carregarJSON(chave) {
    try {
      var val = localStorage.getItem(chave);
      return val ? JSON.parse(val) : null;
    } catch (e) {
      return null;
    }
  }

});
