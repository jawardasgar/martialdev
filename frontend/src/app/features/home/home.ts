import {
  Component,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
  OnInit,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HeroComponent } from './hero/hero';

interface HNStory {
  id: number;
  title: string;
  url?: string;
  time: number;
}

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [HeroComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit, AfterViewInit {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Handle route-based section scrolling
    if (isPlatformBrowser(this.platformId)) {
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((event: any) => {
          const path = event.urlAfterRedirects || event.url;
          this.scrollToSectionFromPath(path);
        });
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Check initial route and scroll
      setTimeout(() => {
        this.scrollToSectionFromPath(this.router.url);
      }, 500);

      // Load animated background first
      this.loadScript('/animated-background.js', () => {
        if (typeof (window as any).initAnimatedBackground === 'function') {
          (window as any).initAnimatedBackground();
        }
      });

      // Load script.js and manually trigger counters and observers
      this.loadScript('/script.js', () => {
        // Script has loaded but DOMContentLoaded already fired
        // Manually Initialize features that were in DOMContentLoaded
        this.initializeScriptFeatures();
      });

      // Load news after a small delay to ensure DOM is ready
      setTimeout(() => this.loadNews(), 100);
    }
  }

  private scrollToSectionFromPath(path: string): void {
    // Extract section from path (e.g., /about -> about)
    const section = path.replace('/', '').split(/[?#]/)[0];
    if (section && section !== '') {
      setTimeout(() => {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  }

  private initializeScriptFeatures(): void {
    // Manually trigger stat counters
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach((element) => {
      const target = parseInt(element.getAttribute('data-target') || '0');
      if (isNaN(target)) return;
      let current = 0;
      const increment = target / 60;
      const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
          element.textContent = target.toString();
          clearInterval(interval);
        } else {
          element.textContent = Math.floor(current).toString();
        }
      }, 30);
    });

    // Trigger parallax observers if they exist
    const parallaxSections = document.querySelectorAll('.parallax-section');
    if (parallaxSections.length > 0 && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-in');
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
      );
      parallaxSections.forEach((section) => observer.observe(section));
    }
  }

  private loadScript(src: string, callback?: () => void): void {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) existing.remove();
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    if (callback) {
      script.onload = () => callback();
    }
    document.body.appendChild(script);
  }

  private async loadNews(): Promise<void> {
    const newsGrid = document.getElementById('newsGrid');
    if (!newsGrid) return;

    try {
      const idsResp = await fetch(
        'https://hacker-news.firebaseio.com/v0/topstories.json',
      );
      const topIds: number[] = await idsResp.json();
      const stories = await Promise.all(
        topIds
          .slice(0, 6)
          .map((id) =>
            fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(
              (r) => r.json() as Promise<HNStory>,
            ),
          ),
      );
      newsGrid.innerHTML = '';
      stories.forEach((story) => {
        if (!story || !story.title) return;
        const card = document.createElement('div');
        card.className = 'news-card group';
        const date = new Date(story.time * 1000);
        card.innerHTML = `
          <div class="news-tag">Tech News</div>
          <h3 class="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">${story.title}</h3>
          <p class="text-blue-200 mb-4 text-sm">${story.title.substring(0, 120)}...</p>
          <div class="flex items-center justify-between">
            <span class="text-sm text-blue-300">${date.toLocaleDateString()}</span>
            <a href="${story.url || 'https://news.ycombinator.com/item?id=' + story.id}" target="_blank"
               class="text-cyan-400 font-semibold text-sm hover:text-cyan-300 transition-colors">Read Article →</a>
          </div>`;
        newsGrid.appendChild(card);
      });
    } catch {
      this.loadFallbackNews(newsGrid);
    }
  }

  private loadFallbackNews(newsGrid: HTMLElement): void {
    const articles = [
      {
        title: 'The Rise of AI in Enterprise Software',
        desc: 'Explore how enterprise companies are leveraging AI to transform their operations.',
        url: 'https://techcrunch.com',
        tag: 'AI',
      },
      {
        title: 'Web Development Trends for 2026',
        desc: 'Latest frameworks and best practices shaping web development.',
        url: 'https://dev.to',
        tag: 'Web Dev',
      },
      {
        title: 'Cloud Computing Best Practices',
        desc: 'Essential strategies for optimizing cloud infrastructure.',
        url: 'https://aws.amazon.com/blogs/',
        tag: 'Cloud',
      },
      {
        title: 'Cybersecurity Threats in 2026',
        desc: 'Understanding emerging security challenges and solutions.',
        url: 'https://www.csoonline.com',
        tag: 'Security',
      },
      {
        title: 'Mobile App Development Evolution',
        desc: 'How cross-platform frameworks are revolutionizing development.',
        url: 'https://flutter.dev',
        tag: 'Mobile',
      },
      {
        title: 'DevOps and Continuous Integration',
        desc: 'Streamlining deployment pipelines for faster releases.',
        url: 'https://www.docker.com/blog',
        tag: 'DevOps',
      },
    ];
    newsGrid.innerHTML = '';
    articles.forEach((a) => {
      const card = document.createElement('div');
      card.className = 'news-card group';
      card.innerHTML = `
        <div class="news-tag">${a.tag}</div>
        <h3 class="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">${a.title}</h3>
        <p class="text-blue-200 mb-4 text-sm">${a.desc}</p>
        <div class="flex items-center justify-between">
          <span class="text-sm text-blue-300">${new Date().toLocaleDateString()}</span>
          <a href="${a.url}" target="_blank"
             class="text-cyan-400 font-semibold text-sm hover:text-cyan-300 transition-colors">Read Article →</a>
        </div>`;
      newsGrid.appendChild(card);
    });
  }
}
