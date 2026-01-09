<script>
  import { onMount } from 'svelte';

  onMount(() => {
    // Load Mailjet embedded script
    const script = document.createElement('script');
    script.src = 'https://app.mailjet.com/pas-nc-embedded-v1.js';
    script.type = 'text/javascript';
    document.body.appendChild(script);

    return () => {
      // Cleanup script on component unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  });
</script>

<div class="newsletter-section">
  <h3 class="h3">Willst du den Newsletter abonnieren?</h3>
  <p>
    Melde dich bei unserem Newsletter an, um aktuelle Informationen vom Gesundheitskollektiv Berlin zu bekommen. 
    Wir berichten in unregelmäßigen Abständen über aktuelle Angebote, neue Pläne und anstehende Veranstaltungen.
  </p>
  
  <iframe
    data-w-type="embedded"
    frameborder="0"
    scrolling="no"
    marginheight="0"
    marginwidth="0"
    src="https://x983w.mjt.lu/wgt/x983w/vrn/form?c=4f94931a"
    width="100%"
    style="height: 232px; overflow: hidden;"
    title="Newsletter Anmeldung"
  ></iframe>
</div>
