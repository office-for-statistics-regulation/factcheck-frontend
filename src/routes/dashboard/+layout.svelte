<script>
      import { page } from '$app/stores';

    let currentPath = $page.route.id;

</script>

<h1>Horizon-Scanning Dashboard</h1>


<!-- <div style="width: 90%; max-width: fit-content; margin: 0 auto; display:flex;">
  <a href="/dashboard/retweets" style="text-decoration: none;">
    <div class="dash-link">Recent Retweets</div>
  </a>
  <a href="/dashboard/retweets" style="text-decoration: none;">
    <div class="dash-link">30 Day Topic Trends</div>
  </a>
</div> -->
<div style="width: 90%; max-width: fit-content; margin: 0 auto; display:flex;">
  <div class="twitter" style="border: 0.5px grey solid;margin:2px;">
    <h4 style="text-align: center;margin: 10px;">Twitter</h4>
    <div style="display: flex;">
      <a href="/dashboard/retweets" style="text-decoration: none;">
        <div class="dash-link" class:shadedBox={(currentPath=="/dashboard/retweets")}>Recent Retweets</div>
      </a>
      <a href="/dashboard/topics" style="text-decoration: none;">
          <div class="dash-link" class:shadedBox={(currentPath=="/dashboard/topics")}>30 Day Domain Trends</div>
      </a>
      <a href="/dashboard/hashtags" style="text-decoration: none;">
          <div class="dash-link" class:shadedBox={(currentPath=="/dashboard/hashtags")}>Domain Hashtags</div>
      </a>
      <a href="/dashboard/accounts" style="text-decoration: none;">
        <div class="dash-link" class:shadedBox={(currentPath=="/dashboard/accounts")}>Accounts by Domain</div>
      </a>
      <a href="/dashboard/tags" style="text-decoration: none;">
        <div class="dash-link" class:shadedBox={(currentPath=="/dashboard/tags")}>OSR Tags</div>
      </a>
    </div>
  </div>
  <div class="other" style="border: 0.5px grey solid;margin:2px;">
    <h4 style="text-align: center;margin: 10px;">Other</h4>
    <div style="display: flex;">
      <a href="/dashboard/media" style="text-decoration: none;">
        <div class="dash-link" class:shadedBox={(currentPath=="/dashboard/media")}>Media Search Terms</div>
      </a>
      <a href="/dashboard/release" style="text-decoration: none;">
        <div class="dash-link" class:shadedBox={(currentPath=="/dashboard/release")}>Release Calendar</div>
      </a>
    </div>
  </div>
</div>
<br>

<slot></slot>


<style>
  .shadedBox {
    background-color: rgba(215, 215, 215, 0.572);
  }
  .dash-link {
    text-decoration: none;
    border: #ccc 1px solid;
    padding: 10px;
    margin: 5px;
  }
</style>
