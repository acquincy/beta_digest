New-Item -ItemType Directory -Force -Path "screenshots"

$screenshots = @(
  @{ name="landing-1440.png"; url="http://localhost:3300/"; width="1440"; height="900"; fullPage=$true },
  @{ name="landing-360.png"; url="http://localhost:3300/"; width="360"; height="800"; fullPage=$true },
  @{ name="signup-s1-1440.png"; url="http://localhost:3300/signup?step=1"; width="1440"; height="900"; fullPage=$true },
  @{ name="signup-s1-360.png"; url="http://localhost:3300/signup?step=1"; width="360"; height="800"; fullPage=$true },
  @{ name="signup-s2-1440.png"; url="http://localhost:3300/signup?step=2"; width="1440"; height="900"; fullPage=$true },
  @{ name="signup-s2-360.png"; url="http://localhost:3300/signup?step=2"; width="360"; height="800"; fullPage=$true },
  @{ name="basic-info-1440.png"; url="http://localhost:3300/basic-info"; width="1440"; height="900"; fullPage=$true },
  @{ name="basic-info-360.png"; url="http://localhost:3300/basic-info"; width="360"; height="800"; fullPage=$true },
  @{ name="step1-time-location-1440.png"; url="http://localhost:3300/set-up-reports?step=1"; width="1440"; height="900"; fullPage=$true },
  @{ name="step1-time-location-360.png"; url="http://localhost:3300/set-up-reports?step=1"; width="360"; height="800"; fullPage=$true },
  @{ name="step2-topics-1440.png"; url="http://localhost:3300/set-up-reports?step=2"; width="1440"; height="900"; fullPage=$true },
  @{ name="step2-topics-360.png"; url="http://localhost:3300/set-up-reports?step=2"; width="360"; height="800"; fullPage=$true },
  @{ name="step3-weather-1440.png"; url="http://localhost:3300/set-up-reports?step=3"; width="1440"; height="900"; fullPage=$true },
  @{ name="step3-weather-360.png"; url="http://localhost:3300/set-up-reports?step=3"; width="360"; height="800"; fullPage=$true },
  @{ name="review-1440.png"; url="http://localhost:3300/set-up-reports?step=review"; width="1440"; height="900"; fullPage=$true },
  @{ name="review-360.png"; url="http://localhost:3300/set-up-reports?step=review"; width="360"; height="800"; fullPage=$true },
  @{ name="dashboard-1440.png"; url="http://localhost:3300/dashboard"; width="1440"; height="900"; fullPage=$true },
  @{ name="dashboard-360.png"; url="http://localhost:3300/dashboard"; width="360"; height="800"; fullPage=$true }
)

foreach ($s in $screenshots) {
  $file = "screenshots/$($s.name)"
  $viewport = "$($s.width),$($s.height)"
  Write-Host "Capturing $($s.name)..."
  if ($s.fullPage) {
    npx playwright screenshot --channel msedge --viewport-size $viewport --wait-for-timeout 1000 --full-page $s.url $file
  } else {
    npx playwright screenshot --channel msedge --viewport-size $viewport --wait-for-timeout 1000 $s.url $file
  }
}
Write-Host "All screenshots captured successfully!"
