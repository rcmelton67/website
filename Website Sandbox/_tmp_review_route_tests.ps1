$base = "http://localhost:8002"
$urls = @(
  "/reviews/clusters/dog-memorial-stone-reviews/",
  "/reviews/clusters/dog-memorial-stone-reviews/page/2/",
  "/reviews/dog-memorial-stone-reviews/",
  "/reviews/intent/quality-pet-memorial-reviews/"
)

foreach ($u in $urls) {
  try {
    $r = Invoke-WebRequest -Uri ($base + $u) -MaximumRedirection 0 -UseBasicParsing -ErrorAction Stop
    Write-Output ("{0} => {1}" -f $u, $r.StatusCode)
  } catch {
    $resp = $_.Exception.Response
    if ($resp) {
      $code = [int]$resp.StatusCode
      $loc = $null
      try { $loc = $resp.GetResponseHeader("Location") } catch { }
      if ($loc) {
        Write-Output ("{0} => {1} Location={2}" -f $u, $code, $loc)
      } else {
        Write-Output ("{0} => {1}" -f $u, $code)
      }
    } else {
      Write-Output ("{0} => ERROR {1}" -f $u, $_.Exception.Message)
    }
  }
}

