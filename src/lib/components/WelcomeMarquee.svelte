<script>
  const parts = ['Willkommen', 'Bienvenue', 'Bun venit', 'Welcome', 'Hoşgeldiniz', 'مرحبا بك'];
</script>

<div class="welcome-marquee" aria-label="Welcome in multiple languages">
  <div class="welcome-marquee__track">
    {#each [0, 1] as copy (copy)}
      <div class="welcome-marquee__set" aria-hidden={copy === 1 ? 'true' : undefined}>
        {#each parts as word, i (i)}
          <span class="welcome-marquee__word">{word}</span>
          <span class="welcome-marquee__dash" aria-hidden="true">—</span>
        {/each}
        {#each parts as word, i (i)}
          <span class="welcome-marquee__word">{word}</span>
          <span class="welcome-marquee__dash" aria-hidden="true">—</span>
        {/each}
      </div>
    {/each}
  </div>
</div>

<style>
  .welcome-marquee {
    overflow: hidden;
    background: #fff;
    color: #000;
    padding: 0.75rem 0;
    font-family: "CerebriSansPro", system-ui, sans-serif;
    font-weight: 700;
    font-size: 1.25rem;
    line-height: 1.2;
  }

  .welcome-marquee__track {
    display: flex;
    width: max-content;
    animation: marquee 80s linear infinite;
    will-change: transform;
  }

  .welcome-marquee__set {
    display: flex;
    flex: 0 0 auto;
  }

  .welcome-marquee__word,
  .welcome-marquee__dash {
    padding: 0 0.9rem;
    white-space: nowrap;
  }

  @keyframes marquee {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }

  @media (prefers-reduced-motion: reduce) {
    .welcome-marquee__track {
      animation: none;
    }
  }
</style>
