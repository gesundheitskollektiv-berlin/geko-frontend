<script>
  export let data = {};
  export let events = [];
  export let anchor = '';

  // data and events are kept for future calendar implementation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = { data, events };

  $: backgroundClass = data?.background_color ? `bg-geko-${data.background_color}` : 'bg-geko-white';
</script>

<section id={anchor || undefined}>
  <div class={backgroundClass}>
    <div class="container" id="contact">
      <!-- TODO: Implement calendar component -->
      <!-- Calendar will be implemented with FullCalendar or similar -->
      <div class="pb-3 text-center" id="calendar-title"></div>
      <div id="calendar"></div>

      <div id="calendar-legend" class="pt-3">
        <ul>
          <li class="background-color-blue calendar-legend-item">
            <span>
              Im
              <a class="text-decoration-underline" href="#block-4"
                >Geko Stadtteil-Gesundheits-Zentrum</a
              >
            </span>
          </li>
          <li class="background-color-yellow calendar-legend-item">
            <span>Im Kiez</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</section>
