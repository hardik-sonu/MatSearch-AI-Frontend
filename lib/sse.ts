const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://mat-search-ai-backend.vercel.app";

export class SearchEventStream {
  private eventSource: EventSource | null = null;
  private onMessage: (event: any) => void;
  private onError: (error: any) => void;
  private searchId: string;
  private shouldReconnect: boolean = true;

  constructor(searchId: string, onMessage: (event: any) => void, onError: (error: any) => void) {
    this.searchId = searchId;
    this.onMessage = onMessage;
    this.onError = onError;
  }

  connect() {
    if (this.eventSource) return;
    
    this.eventSource = new EventSource(`${API_BASE_URL}/api/search/${this.searchId}/events`);
    
    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.onMessage(data);
        
        if (data.status === 'completed' || data.status === 'failed') {
          this.disconnect();
        }
      } catch (err) {
        console.error("Error parsing SSE event:", err);
      }
    };
    
    this.eventSource.onerror = (err) => {
      // EventSource generic errors don't carry much useful info and often trigger 
      // just because of a serverless disconnect or timeout.
      this.onError(err);
      this.disconnect();
      if (this.shouldReconnect) {
        setTimeout(() => this.connect(), 3000);
      }
    };
  }

  disconnect() {
    this.shouldReconnect = false;
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}
