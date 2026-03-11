import {
  Component,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HeroComponent } from './hero/hero';

interface DevtoArticle {
  id: number;
  title: string;
  url: string;
  description?: string;
  cover_image?: string;
  social_image?: string;
  published_at: string;
  tag_list?: string[] | string;
}

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [HeroComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit, AfterViewInit {
  private readonly NEWS_REFRESH_MS = 1000 * 60 * 20;
  private newsRefreshTimer: ReturnType<typeof setInterval> | null = null;
  private readonly handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      this.loadNews();
    }
  };

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

      const isMobile = window.matchMedia('(max-width: 767px)').matches;

      // Defer non-critical scripts so first paint/interaction happens sooner.
      this.runWhenIdle(() => {
        if (!isMobile) {
          this.loadScript('/animated-background.js', () => {
            if (typeof (window as any).initAnimatedBackground === 'function') {
              (window as any).initAnimatedBackground();
            }
          });
        }

        this.loadScript('/script.js', () => {
          // Script has loaded but DOMContentLoaded already fired
          // Manually initialize features that were in DOMContentLoaded
          this.initializeScriptFeatures();
        });
      }, 700);

      // Keep news loading reliable while avoiding contention with initial render.
      this.runWhenIdle(() => this.loadNews(), 900);
      this.startNewsRefresh();
    }
  }

  ngOnDestroy(): void {
    if (this.newsRefreshTimer) {
      clearInterval(this.newsRefreshTimer);
      this.newsRefreshTimer = null;
    }

    if (isPlatformBrowser(this.platformId)) {
      document.removeEventListener(
        'visibilitychange',
        this.handleVisibilityChange,
      );
    }
  }

  private runWhenIdle(callback: () => void, timeout = 800): void {
    const w = window as Window & {
      requestIdleCallback?: (
        cb: (deadline: { timeRemaining: () => number; didTimeout: boolean }) => void,
        options?: { timeout: number },
      ) => number;
    };

    if (typeof w.requestIdleCallback === 'function') {
      w.requestIdleCallback(() => callback(), { timeout });
      return;
    }

    setTimeout(callback, 120);
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
      const tags = ['webdev', 'javascript', 'typescript', 'ai', 'cloud'];
      const responses = await Promise.all(
        tags.map((tag) =>
          fetch(`https://dev.to/api/articles?tag=${tag}&per_page=12`),
        ),
      );

      const articleGroups = await Promise.all(
        responses.map((resp) => {
          if (!resp.ok) {
            throw new Error('Failed to fetch digital marketing articles');
          }
          return resp.json() as Promise<DevtoArticle[]>;
        }),
      );

      const articleMap = new Map<number, DevtoArticle>();
      articleGroups.flat().forEach((article) => {
        if (article?.id && article.title && article.url) {
          articleMap.set(article.id, article);
        }
      });

      const articles = Array.from(articleMap.values())
        .filter((article) => this.isTechArticle(article))
        .sort(
          (a, b) =>
            new Date(b.published_at).getTime() -
            new Date(a.published_at).getTime(),
        )
        .slice(0, 6);

      newsGrid.innerHTML = '';

      articles.forEach((article) => {
        const card = document.createElement('div');
        card.className = 'news-card group';

        const image =
          article.cover_image ||
          article.social_image ||
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80';
        const date = new Date(article.published_at);
        const tag = this.getPrimaryTag(article.tag_list);
        const title = this.escapeHtml(article.title);
        const description = this.escapeHtml(
          this.truncate(
            article.description ||
              'Insights and strategies from the digital marketing world.',
            120,
          ),
        );

        card.innerHTML = `
          <div class="news-card-media">
            <img src="${image}" alt="${title}" loading="lazy" referrerpolicy="no-referrer" />
          </div>
          <div class="news-card-body">
          <div class="news-tag">${tag}</div>
          <h3 class="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">${title}</h3>
          <p class="text-blue-200 mb-4 text-sm">${description}</p>
          <div class="flex items-center justify-between">
            <span class="text-sm text-blue-300">${date.toLocaleDateString()}</span>
            <a href="${article.url}" target="_blank" rel="noopener noreferrer"
               class="text-cyan-400 font-semibold text-sm hover:text-cyan-300 transition-colors">Read Article →</a>
          </div>
          </div>`;

        newsGrid.appendChild(card);
      });

      if (articles.length === 0) {
        this.loadFallbackNews(newsGrid);
      }
    } catch {
      this.loadFallbackNews(newsGrid);
    }
  }

  private startNewsRefresh(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (this.newsRefreshTimer) {
      clearInterval(this.newsRefreshTimer);
    }

    this.newsRefreshTimer = setInterval(() => {
      this.loadNews();
    }, this.NEWS_REFRESH_MS);

    // Refresh once when user returns to the tab to keep content up to date.
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  private isTechArticle(article: DevtoArticle): boolean {
    const tags = Array.isArray(article.tag_list)
      ? article.tag_list.join(' ')
      : article.tag_list || '';
    const haystack = `${article.title} ${article.description || ''} ${tags}`.toLowerCase();

    const techKeywords = [
      'ai',
      'ml',
      'software',
      'developer',
      'web',
      'cloud',
      'devops',
      'cyber',
      'security',
      'api',
      'typescript',
      'javascript',
      'react',
      'angular',
      'node',
      'mobile',
      'saas',
      'data',
      'startup',
      'engineering',
      'programming',
      'frontend',
      'backend',
      'product',
      'tech',
    ];

    return techKeywords.some((keyword) => haystack.includes(keyword));
  }

  private loadFallbackNews(newsGrid: HTMLElement): void {
    const articles = [
      {
        title: 'Digital Marketing Trends to Watch in 2026',
        desc: 'A practical look at what is changing across SEO, paid ads, and conversion strategies this year.',
        url: 'https://blog.hubspot.com/marketing',
        tag: 'Marketing',
        image:
          'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'SEO Strategy That Still Works',
        desc: 'How technical SEO, content clusters, and search intent alignment drive sustained organic growth.',
        url: 'https://moz.com/blog',
        tag: 'SEO',
        image:
          'https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Email Campaign Playbook for Better Conversions',
        desc: 'Use segmentation, timing, and lifecycle automation to improve opens, clicks, and revenue.',
        url: 'https://mailchimp.com/resources/',
        tag: 'Email',
        image:
          'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Social Media Content That Performs',
        desc: 'Frameworks for planning content calendars that increase engagement and qualified traffic.',
        url: 'https://later.com/blog/',
        tag: 'Social',
        image:
          'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Landing Page Optimization Checklist',
        desc: 'Simple CRO improvements to make your pages clearer, faster, and easier to convert on mobile.',
        url: 'https://neilpatel.com/blog/',
        tag: 'CRO',
        image:
          'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Attribution in a Cookieless World',
        desc: 'How teams are adapting channel measurement when traditional tracking becomes less reliable.',
        url: 'https://www.thinkwithgoogle.com/',
        tag: 'Analytics',
        image:
          'https://images.unsplash.com/photo-1551281044-8b2fcf7b33f1?auto=format&fit=crop&w=1200&q=80',
      },
    ];
    newsGrid.innerHTML = '';
    articles.forEach((a) => {
      const card = document.createElement('div');
      card.className = 'news-card group';

      const title = this.escapeHtml(a.title);
      const description = this.escapeHtml(a.desc);

      card.innerHTML = `
        <div class="news-card-media">
          <img src="${a.image}" alt="${title}" loading="lazy" referrerpolicy="no-referrer" />
        </div>
        <div class="news-card-body">
        <div class="news-tag">${a.tag}</div>
        <h3 class="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">${title}</h3>
        <p class="text-blue-200 mb-4 text-sm">${description}</p>
        <div class="flex items-center justify-between">
          <span class="text-sm text-blue-300">${new Date().toLocaleDateString()}</span>
          <a href="${a.url}" target="_blank" rel="noopener noreferrer"
             class="text-cyan-400 font-semibold text-sm hover:text-cyan-300 transition-colors">Read Article →</a>
        </div>
        </div>`;
      newsGrid.appendChild(card);
    });
  }

  private getPrimaryTag(tags?: string[] | string): string {
    if (Array.isArray(tags) && tags.length > 0) {
      return this.escapeHtml(this.toTitleCase(tags[0]));
    }
    if (typeof tags === 'string' && tags.trim().length > 0) {
      const firstTag = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)[0];
      if (firstTag) {
        return this.escapeHtml(this.toTitleCase(firstTag));
      }
    }
    return 'Digital Marketing';
  }

  private truncate(value: string, maxLength: number): string {
    if (value.length <= maxLength) {
      return value;
    }
    return `${value.slice(0, maxLength).trimEnd()}...`;
  }

  private toTitleCase(value: string): string {
    return value
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
