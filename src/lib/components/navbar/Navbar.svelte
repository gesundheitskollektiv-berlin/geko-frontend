<script>
  import DesktopNav from './DesktopNav.svelte';
  import MobileNav from './MobileNav.svelte';

  let { locale = 'de' } = $props();
</script>

<div class="d-none d-xl-block"><DesktopNav {locale} /></div>
<div class="d-block d-xl-none"><MobileNav {locale} /></div>
