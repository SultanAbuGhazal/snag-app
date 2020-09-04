import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'projects',
    pathMatch: 'full'
  },
  {
    path: 'projects',
    loadChildren: () => import('../pages/projects/projects.module').then( m => m.ProjectsPageModule)
  },
  {
    path: 'new-project',
    loadChildren: () => import('../pages/new-project/new-project.module').then( m => m.NewProjectPageModule)
  },
  {
    path: 'project/:project_id/comment',
    loadChildren: () => import('../pages/comment/comment.module').then( m => m.CommentPageModule)
  },
  {
    path: 'project/:project_id/comment/:id',
    loadChildren: () => import('../pages/comment/comment.module').then( m => m.CommentPageModule)
  },
  {
    path: 'project/:project_id/snag-list',
    loadChildren: () => import('../pages/snag-list/snag-list.module').then( m => m.SnagListPageModule)
  },
  {
    path: 'project/:project_id/report-preview',
    loadChildren: () => import('../pages/report-preview/report-preview.module').then( m => m.ReportPreviewPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
