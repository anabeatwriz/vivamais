/* =============================================
   VIVA MAIS — script.js
   Interatividade leve e acessível
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ----- Cards expandíveis de dicas de saúde ----- */
  const cardsExpandiveis = document.querySelectorAll('.card-dica-expandivel');

  cardsExpandiveis.forEach(function (card) {
    const header = card.querySelector('.card-dica-header');
    const conteudo = card.querySelector('.card-dica-conteudo');

    if (!header || !conteudo) return;

    header.addEventListener('click', function () {
      const estaAberto = card.classList.contains('aberto');

      /* fecha todos primeiro */
      cardsExpandiveis.forEach(function (outro) {
        outro.classList.remove('aberto');
      });

      /* abre o clicado se estava fechado */
      if (!estaAberto) {
        card.classList.add('aberto');
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
  const elementoSaudacao = document.getElementById('saudacao');
  if (elementoSaudacao) {
    const hora = new Date().getHours();
    let saudacao = 'Boa noite!';
    if (hora >= 5 && hora < 12)  saudacao = 'Bom dia!';
    else if (hora >= 12 && hora < 18) saudacao = 'Boa tarde!';
    elementoSaudacao.textContent = saudacao;
  }

  /* ----- Banner de emergência via botão do header ----- */
  const btnEmergenciaHeader = document.getElementById('btn-emergencia-header');
  const bannerSos = document.getElementById('banner-sos');
  const btnFecharBanner = document.getElementById('fechar-banner');

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
      const alvo = document.querySelector(this.getAttribute('href'));
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
    });
    card.addEventListener('touchend', function () {
      card.style.opacity = '';
    });
  });

});
