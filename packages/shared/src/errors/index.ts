export class NexusError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'NexusError';
  }
}

export class ValidationError extends NexusError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends NexusError {
  constructor(message: string) {
    super(message, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class SyncError extends NexusError {
  constructor(message: string) {
    super(message, 'SYNC_ERROR');
    this.name = 'SyncError';
  }
}
